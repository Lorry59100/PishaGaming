<?php

// src/Form/AddressType.php
namespace App\Form;

use App\Entity\Address;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class AddressType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
                ->add('firstname', TextType::class, ['label' => 'Prénom'])
                ->add('lastname', TextType::class, ['label' => 'Nom'])
                ->add('housenumber', TextType::class, [
                    'label' => 'Numéro de maison',
                ])
                ->add('street', TextType::class, ['label' => 'Rue'])
                ->add('city', TextType::class, ['label' => 'Ville'])
                ->add('postcode', IntegerType::class, ['label' => 'Code postal'])
                ->add('isActive', CheckboxType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Address::class,
        ]);
    }
}
